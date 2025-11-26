package com.mambu.expense.controller;

import com.mambu.expense.service.ChangeNotificationService;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/events")
@CrossOrigin
public class NotificationController {

    private final ChangeNotificationService notificationService;

    public NotificationController(ChangeNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping(path = "/changes", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChanges() {
        SseEmitter emitter = notificationService.subscribe();
        try {
            emitter.send(SseEmitter.event().name("ready").data("listening"));
        } catch (IOException ignored) {
            // Client disconnected right after subscribing; ignoring is fine.
        }
        return emitter;
    }
}
