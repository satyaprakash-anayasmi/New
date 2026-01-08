package com.example.curd.services.imps;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.curd.entities.MeetingEntity;
import com.example.curd.repositories.MeetingRepository;
import com.example.curd.services.MeetingService;

@Service
public class MeetingServiceImpl implements MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;

    @Override
    public MeetingEntity saveMeeting(MeetingEntity meeting) {
        return meetingRepository.save(meeting);
    }

    @Override
    public List<MeetingEntity> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    public MeetingEntity getMeetingById(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + id));
    }

    @Override
    public MeetingEntity updateMeeting(Long id, MeetingEntity meeting) {
        if (!meetingRepository.existsById(id)) {
            throw new RuntimeException("Meeting not found with id: " + id);
        }
        meeting.setId(id);
        return meetingRepository.save(meeting);
    }

    @Override
    public void deleteMeeting(Long id) {
        meetingRepository.deleteById(id);
    }
}