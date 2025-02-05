package com.api.backend.notification.service;

import static com.api.backend.global.exception.type.ErrorCode.NOTIFICATION_IS_READ_TRUE_EXCEPTION;
import static com.api.backend.global.exception.type.ErrorCode.NOTIFICATION_NOT_FOUND_EXCEPTION;
import static com.api.backend.global.exception.type.ErrorCode.NOTIFICATION_NOT_VALID_EXCEPTION;
import static com.api.backend.global.exception.type.ErrorCode.TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION;

import com.api.backend.global.exception.CustomException;
import com.api.backend.member.data.entity.Member;
import com.api.backend.notification.data.entity.Notification;
import com.api.backend.notification.data.repository.NotificationRepository;
import com.api.backend.team.data.entity.Team;
import com.api.backend.team.data.entity.TeamParticipants;
import com.api.backend.team.service.TeamParticipantsService;
import com.api.backend.team.service.TeamService;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;
  private final TeamParticipantsService teamParticipantsService;
  private final TeamService teamService;

  public void saveAllNotification(List<Notification> notifications) {
    notificationRepository.saveAll(notifications);
  }


  public void saveNotification(Notification notification) {
    notificationRepository.save(notification);
  }


  public void memberReadNotification(Long notificationId, Long memberId) {
    Notification notification = getNotification(
        notificationId);

    if (Objects.isNull(notification.getMember()) &&
        !Objects.equals(memberId, notification.getMember().getMemberId())
    ) {
      throw new CustomException(NOTIFICATION_NOT_VALID_EXCEPTION);
    }

    if (notification.isRead()) {
      throw new CustomException(NOTIFICATION_IS_READ_TRUE_EXCEPTION);
    }

    notification.setRead(true);
  }

  private Notification getNotification(Long notificationId) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new CustomException(NOTIFICATION_NOT_FOUND_EXCEPTION));
    return notification;
  }

  public void teamParticipantsReadNotification(
      Long notificationId, Long teamParticipantsId, Long memberId
  ) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new CustomException(NOTIFICATION_NOT_FOUND_EXCEPTION));

    if (Objects.isNull(notification.getTeamParticipants())) {
      throw new CustomException(TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION);
    }

    TeamParticipants teamParticipants = notification.getTeamParticipants();
    Member member = teamParticipants.getMember();

    if ((!teamParticipants.getTeamParticipantsId()
        .equals(teamParticipantsId)) ||
        (!member.getMemberId()
            .equals(memberId))) {
      throw new CustomException(NOTIFICATION_NOT_VALID_EXCEPTION);
    }

    notification.setRead(true);
  }
  public Page<Notification> getTeamNotificationList(Long teamId, Long memberId, Pageable pageable) {
    TeamParticipants teamParticipants = teamParticipantsService.getTeamParticipant(teamId, memberId);

    Team team = teamParticipants.getTeam();

    teamService.isDeletedCheck(team.getRestorationDt(), team.isDelete());

    return notificationRepository.findAllByTeamParticipantsAndIsReadFalse(teamParticipants, pageable);
  }

  public Page<Notification> getMemberNotificationList(Long memberId, Pageable pageable) {
    return notificationRepository.findAllByMember_MemberIdAndIsReadFalse(memberId, pageable);
  }
}
