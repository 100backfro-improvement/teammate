package com.api.backend.notification.data.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Type {
  DOCUMENTS("문서"),
  COMMENT("댓글"),
  EXIT_TEAM_PARTICIPANT("팀원 탈퇴"),
  KICKOUT("강퇴"),
  MENTION("멘션"),
  INVITE("초대");

  private final String description;

}
