import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const AppointmentSlotCreateByWeeks = (userId) => {
    const UserId = userId.userId;
  const [formData, setFormData] = useState({
    DoctorId: '',
    ClinicId: UserId,
    StartTime: '',
    EndTime: '',
    IsBooked: false,
    Date: '', // Add Date field
    PatientId: null,
    Weeks: 1, // Add Weeks field with default value 1
  });
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`https://localhost:7207/api/Doctor/clinic/${UserId}`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          console.error('Failed to fetch doctors:', response.status);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [userId]);
  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:00`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue;

    if (name === 'IsBooked') {
      parsedValue = e.target.checked;
    } else if (name === 'StartTime' || name === 'EndTime') {
      // Convert time to 24-hour format
      parsedValue = convertTo24HourFormat(value);
    } else {
      parsedValue = name === 'Date' ? value : value;
    }

    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requestData = { ...formData, numberOfWeeks: parseInt(formData.Weeks, 10) };

    try {
      console.log('Request Data:', requestData); // Log the request data for debugging
      const queryParams = new URLSearchParams({ numberOfWeeks: requestData.numberOfWeeks }).toString();
      const url = `https://localhost:7207/api/AppointmentSlot/CreateByWeeks?${queryParams}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Include numberOfWeeks in the request body
      });
  
      if (response.ok) {
        console.log('Appointment Slot created successfully!');
        window.location.href = '/appointment-slot-list';
        // Add any success handling logic here
      } else {
        const errorData = await response.json();
        console.error('Failed to create Appointment Slot:', errorData);
  
        // Log detailed validation errors, if available
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            console.error(`${key}: ${errorData.errors[key].join(', ')}`);
          });
        }
  
        // Add error handling logic here
      }
    } catch (error) {
      console.error('Error creating Appointment Slot:', error);
      // Handle other types of errors (e.g., network issues)
    }
  };
  return (
    <Container>
      <h2>Add Appointment Slot by Weeks</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="DoctorId">
          <Form.Label>Doctor</Form.Label>
          <Form.Control
            as="select"
            name="DoctorId"
            value={formData.DoctorId}
            onChange={handleChange}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} {doctor.surname} {doctor.personalNumber}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="StartTime">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="time"
            name="StartTime"
            value={formData.StartTime}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="EndTime">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="time"
            name="EndTime"
            value={formData.EndTime}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="IsBooked">
          <Form.Check
            type="checkbox"
            label="Is Booked"
            name="IsBooked"
            checked={formData.IsBooked}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="Date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date" // Assuming Date is represented as a string in ISO format (yyyy-MM-dd)
            name="Date"
            value={formData.Date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="Weeks">
          <Form.Label>Weeks</Form.Label>
          <Form.Control
            type="number"
            name="Weeks"
            value={formData.Weeks}
            onChange={handleChange}
            min={1} // Minimum value for Weeks input
            step={1} // Step value for Weeks input
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        {' '}
        <Link to="/appointment-slot-list" className="btn btn-secondary">
          View Appointment Slots
        </Link>
      </Form>
    </Container>
  );
};

export default AppointmentSlotCreateByWeeks;
