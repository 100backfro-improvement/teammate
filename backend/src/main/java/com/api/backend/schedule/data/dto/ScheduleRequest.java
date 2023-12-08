package com.api.backend.schedule.data.dto;

import com.api.backend.schedule.data.type.RepeatCycle;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ScheduleRequest {

  private Long scheduleId;
  private Long teamId;
  private Long categoryId;
  @NotBlank(message = "일정 제목을 입력해주세요.")
  private String title;
  private String content;
  @NotBlank(message = "시작 날짜를 입력해주세요.")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
  private LocalDateTime startDt;
  @NotBlank(message = "종료 날짜를 입력해주세요.")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
  private LocalDateTime endDt;
  private String place;
  private boolean isRepeat;
  private RepeatCycle repeatCycle;
  private List<Long> teamParticipantsIds;
}
