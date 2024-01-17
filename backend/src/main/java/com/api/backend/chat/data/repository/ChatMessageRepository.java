package com.api.backend.chat.data.repository;

import com.api.backend.chat.data.entity.ChatMessage;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ChatMessageRepository  extends ReactiveMongoRepository<ChatMessage,String> {
  @Tailable
  Flux<ChatMessage> findAllByTeamId(Long teamId);
}