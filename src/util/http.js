import { QueryClient } from "@tanstack/react-query";

export async function fetchEvents({signal, searchTerm, max}) {

    let url = 'http://localhost:3000/events';

    if (searchTerm && max){
        url += '?search=' + searchTerm + '&max=' + max;
    }else if (searchTerm){
        url += '?search=' + searchTerm;
    }else if (max){
        url += '?max=' + max;
    }

    const response = await fetch(url, signal);

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
}

export async function createEvent(eventData){

    let url = 'http://localhost:3000/events';

    const response = await fetch(url,{
        method: 'POST',
        body: JSON.stringify(eventData),
        headers:{
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok){
        const error = new Error('An error occurred while creating the event.');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const event = await response.json();

    return event;
}

export async function fetchAvailableImages({signal}){
    const response = await fetch('http://localhost:3000/events/images', {signal})
    
    if (!response.ok){
        const error = new Error("An error occurred while creating the event.");
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const images = await response.json();
    return images
}

export async function fetchEvent({signal, id}){
    const response = await fetch(`http://localhost:3000/events/${id}`, {signal});

    if (!response){
        const error = new Error("An error occurred during function fetching!");
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const {event} = await response.json();
    return event;
}

export async function deleteEvent({id}){
    const response = await fetch(`http://localhost:3000/events/${id}`,{
        method: 'DELETE'
    });

    if (!response){
        const error = new Error("An error occurred during deleting an event!");
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const data = await response.json();
    return data
}

export async function updateEvent({ id, eventData }) {
    console.log(id, eventData)
    const response = await fetch(`http://localhost:3000/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ event: eventData }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (!response.ok) {
      const error = new Error('An error occurred while updating the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const data = await response.json();
  
    return data;
}

export const queryClient = new QueryClient();
