package com.example.curd.controlles;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.curd.dtos.MeetingDTO;
import com.example.curd.entities.MeetingEntity;
import com.example.curd.services.MeetingService;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<MeetingDTO> createMeeting(@RequestBody MeetingDTO meetingDTO) {
        MeetingEntity meetingEntity = modelMapper.map(meetingDTO, MeetingEntity.class);
        MeetingEntity savedMeeting = meetingService.saveMeeting(meetingEntity);
        MeetingDTO responseDTO = modelMapper.map(savedMeeting, MeetingDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MeetingDTO>> getAllMeetings() {
        List<MeetingEntity> meetings = meetingService.getAllMeetings();
        List<MeetingDTO> meetingDTOs = meetings.stream()
                .map(meeting -> modelMapper.map(meeting, MeetingDTO.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(meetingDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingDTO> getMeetingById(@PathVariable Long id) {
        MeetingEntity meeting = meetingService.getMeetingById(id);
        MeetingDTO meetingDTO = modelMapper.map(meeting, MeetingDTO.class);
        return new ResponseEntity<>(meetingDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeetingDTO> updateMeeting(@PathVariable Long id, @RequestBody MeetingDTO meetingDTO) {
        MeetingEntity meetingEntity = modelMapper.map(meetingDTO, MeetingEntity.class);
        MeetingEntity updatedMeeting = meetingService.updateMeeting(id, meetingEntity);
        MeetingDTO responseDTO = modelMapper.map(updatedMeeting, MeetingDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        meetingService.deleteMeeting(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}