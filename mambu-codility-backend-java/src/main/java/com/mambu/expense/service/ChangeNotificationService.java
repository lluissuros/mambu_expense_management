package com.mambu.expense.service;

import com.mambu.expense.dto.ChangeEvent;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class ChangeNotificationService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> removeEmitter(emitter));
        emitter.onError(ex -> removeEmitter(emitter));

        return emitter;
    }

    public void notifyChange(String resource, String action, Long accountId) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        ChangeEvent payload = new ChangeEvent(resource, action, accountId, Instant.now());

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("change")
                        .data(payload));
            } catch (IOException ex) {
                deadEmitters.add(emitter);
            }
        }

        deadEmitters.forEach(this::removeEmitter);
    }

    private void removeEmitter(SseEmitter emitter) {
        emitter.complete();
        emitters.remove(emitter);
    }
}
