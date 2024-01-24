package com.api.backend.chat.controller;

import com.api.backend.chat.data.dto.ChatMessageDto;
import com.api.backend.chat.data.dto.CreateChatMessageRequest;
import com.api.backend.chat.data.entity.ChatMessage;
import com.api.backend.chat.service.ChatMessageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@Api(tags = "채팅")
@RequiredArgsConstructor
@RequestMapping("/team/{teamId}/chat")
public class ChatMessageController {

  private final ChatMessageService chatMessageService;
  @ApiOperation(value = "해당 팀의 오늘 날짜 채팅 내용을 반환하고, 구독을 유지합니다.")
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "채팅 내용을 지속적으로 가져옵니다."),
      @ApiResponse(code = 400, message = "CustomException을 반환합니다."),
  })
  @ApiImplicitParams(
      {
          @ApiImplicitParam(
              name = "access token", value = "jwt access token", required = true
              , dataType = "String", paramType = "header", defaultValue = "None"
          ),
          @ApiImplicitParam(
              name = "teamId"
              , value = "팀 id", required = true, dataType = "Long"
              , paramType = "path", defaultValue = "None", example = "1"
          )
      })
  @GetMapping(value = "", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<ChatMessageDto> subscribeAndGetMessageRequest(
      @ApiIgnore
      Principal principal,
      @PathVariable Long teamId
  ) {
    return chatMessageService
        .subscribeAndGetMsg(Long.valueOf(principal.getName()), teamId)
        .subscribeOn(Schedulers.boundedElastic());
  }

  @ApiOperation(value = "해당 팀의 날짜기반 채팅 내용을 반환합니다.")
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "해당 채팅 날짜기반 내용을 가져왔습니다."),
      @ApiResponse(code = 400, message = "CustomException을 반환합니다."),
  })
  @ApiImplicitParams(
      {
          @ApiImplicitParam(
              name = "access token", value = "jwt access token", required = true
              , dataType = "String", paramType = "header", defaultValue = "None"
          ),
          @ApiImplicitParam(
              name = "teamId"
              , value = "팀 id", required = true, dataType = "Long"
              , paramType = "path", defaultValue = "None", example = "1"
          )
      })
  @GetMapping(value = "/list")
  public Flux<ChatMessageDto> findByTeamMessageRequest(
      @ApiIgnore
      Principal principal,
      @PathVariable Long teamId,
      @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate date
  ) {
    return chatMessageService
        .getChatsByDateTime(
            Long.valueOf(principal.getName()), teamId, date
        );
  }

  @ApiOperation(value = "채팅 내용을 저장합니다.")
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "저장한 내용을 가져왔습니다."),
      @ApiResponse(code = 500, message = "입력값에 대한 인자가 없습니다."),
  })
  @ApiImplicitParams(
      {
          @ApiImplicitParam(
              name = "access token"
              , value = "jwt access token"
              , required = true, dataType = "String"
              , paramType = "header", defaultValue = "None"
          ),
          @ApiImplicitParam(
              name = "teamId"
              , value = "팀 id", required = true
              , dataType = "Long", paramType = "path"
              , defaultValue = "None", example = "1")
      })
  @PostMapping("")
  public Mono<ChatMessage> createMsgRequest(
      @RequestBody @Valid
      CreateChatMessageRequest createChatMessageRequest,
      @PathVariable
      Long teamId
  ){
    return chatMessageService.saveMessage(createChatMessageRequest, teamId);
  }
}
