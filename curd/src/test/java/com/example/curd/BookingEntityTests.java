package com.example.curd;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.curd.entities.BookingEntity;
import com.example.curd.entities.StudentEntity;
import com.example.curd.repositories.StudentRepository;
import com.example.curd.services.BookingService;
import com.example.curd.services.MeetingService;
import com.example.curd.services.StudentService;

@SpringBootTest
public class BookingEntityTests {
    // @Autowired
    // private BookingService bookingService;
    // @Autowired
    // private MeetingService meetingService;

    // @Test
    // public void testAssignBookingToStudent() {
    //     BookingEntity booking = BookingEntity.builder()
    //             .bookingDate("2024-10-10")
    //             .bookingTime("10:00 AM")
    //             .purpose("Library Room Reservation")
    //             .validUntil("2024-10-10 12:00 PM")
    //             .build();

    //     StudentEntity student = bookingService.assignBookingToStudent(booking, 1L);
    // }

//     @Test
//     public void testcreateNewMeeting() {
//         BookingEntity booking = BookingEntity.builder()
//                 .bookingDate("2024-10-15")
//                 .bookingTime("2:00 PM")
//                 .purpose("Study Group Room Reservation")
//                 .validUntil("2024-10-15 4:00 PM")
//                 .build();

//         var newAppointmnet = meetingService.createNewMeeting("2024-10-15", "2:00 PM", "Group Study Session", 1L, 1L, booking);
//         System.out.println(newAppointmnet);

// }
}
