import { Link, redirect, useNavigate, useNavigation, useParams, useSubmit } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import { updateEvent } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const {id} = useParams();
  const {state} = useNavigation();
  const submit = useSubmit();

  const {data, error, isError, isPending}= useQuery({
    queryFn: ({signal})=>fetchEvent({signal, id}),
    queryKey: ['events', id],
    staleTime: 10 * 1000
  })
//Code below is for pure React Query logic with Optimistic updating. 
//The current code is working with balance of React Router loader and action functions, and React Query.
//Instead of useMutation component logic, I added useNavigation and useSubmit hooks of React Router

  // const {mutate, isPending: isPendingUpdating} = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {
  //     const newEvent = data.eventData;
  //     await queryClient.cancelQueries({queryKey: ['events', id]});

  //     const previousEvent = queryClient.getQueryData(['events', id]);
  //     queryClient.setQueryData(['events', id], newEvent);

  //     return {previousEvent}
  //   },
  //   onError: (error, data, context)=>{
  //     queryClient.setQueryData(['events', id], context.previousEvent)
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(['events',id]);
  //   }
  // });
  

  function handleSubmit(formData) {
    submit(formData, {method:'PUT'});
  }

  function handleClose() {
    navigate('../');
  }


  let content;

  if (isError){
    content = (
      <>
        <ErrorBlock title="An error occurred!" message={error.info?.message || "Failed to load event, please check yout inputs"}/>
        <div className='form-actions'>
          <Link to="../" className='button'>
            Okay
          </Link>
        </div>
      </>
    )
  }

  if (data){
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state == 'submitting' && <p>Submitting your data...</p>}
        {state != 'submitting' && (
          <>
            <Link to="../" className="button-text">
            Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}


export function loader({params}){
  const {id} = params;
  return queryClient.fetchQuery({
    queryKey: ['events',{id}],
    queryFn: ({signal})=>fetchEvent({signal, id})
  });
}


export async function action({params, request}){
  const {id} = params;
  const formData = await request.formData();
  const updatedData = Object.fromEntries(formData);
  console.log(updatedData);

  await updateEvent({id, eventData: updatedData});
  await queryClient.invalidateQueries(['events']);
  return redirect('../');
}