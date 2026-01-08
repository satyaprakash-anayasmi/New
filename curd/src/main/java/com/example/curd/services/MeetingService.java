package com.example.curd.services;

import java.util.List;
import com.example.curd.entities.MeetingEntity;

public interface MeetingService {
    MeetingEntity saveMeeting(MeetingEntity meeting);
    List<MeetingEntity> getAllMeetings();
    MeetingEntity getMeetingById(Long id);
    MeetingEntity updateMeeting(Long id, MeetingEntity meeting);
    void deleteMeeting(Long id);
}