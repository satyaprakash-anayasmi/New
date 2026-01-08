package com.example.curd.controlles;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.curd.dtos.BookingDTO;
import com.example.curd.entities.BookingEntity;
import com.example.curd.services.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
        BookingEntity bookingEntity = modelMapper.map(bookingDTO, BookingEntity.class);
        BookingEntity savedBooking = bookingService.saveBooking(bookingEntity);
        BookingDTO responseDTO = modelMapper.map(savedBooking, BookingDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingEntity> bookings = bookingService.getAllBookings();
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(booking -> modelMapper.map(booking, BookingDTO.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        BookingEntity booking = bookingService.getBookingById(id);
        BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
        return new ResponseEntity<>(bookingDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable Long id, @RequestBody BookingDTO bookingDTO) {
        BookingEntity bookingEntity = modelMapper.map(bookingDTO, BookingEntity.class);
        BookingEntity updatedBooking = bookingService.updateBooking(id, bookingEntity);
        BookingDTO responseDTO = modelMapper.map(updatedBooking, BookingDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}