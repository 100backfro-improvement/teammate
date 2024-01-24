package com.api.backend.chat.data.repository;

import com.api.backend.chat.data.entity.ChatMessage;
import java.time.LocalDateTime;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ChatMessageReactRepository extends ReactiveMongoRepository<ChatMessage,String> {
  @Tailable
  @Query("{'teamId': ?0, 'createdDt': {'$gt': ?1, '$lte': ?2}}")
  Flux<ChatMessage> subscribeAndFindMessage(Long teamId, LocalDateTime start, LocalDateTime end);

  @Query("{'teamId': ?0, 'createdDt': {'$gt': ?1, '$lte': ?2}}")
  Flux<ChatMessage> findMessageByDate(Long teamId, LocalDateTime start, LocalDateTime end);

}