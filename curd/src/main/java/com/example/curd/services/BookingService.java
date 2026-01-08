package com.example.curd.services;

import java.util.List;
import com.example.curd.entities.BookingEntity;

public interface BookingService {
    BookingEntity saveBooking(BookingEntity booking);
    List<BookingEntity> getAllBookings();
    BookingEntity getBookingById(Long id);
    BookingEntity updateBooking(Long id, BookingEntity booking);
    void deleteBooking(Long id);
}