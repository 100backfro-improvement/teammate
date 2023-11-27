package com.api.backend.team.data.entity;

import com.api.backend.global.domain.BaseEntity;
import com.api.backend.documents.data.entity.Documents;
import com.api.backend.schedule.data.enetity.Schedule;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long teamId;
  private LocalDateTime reservationTime;
  private boolean deleteYn;
  private int memberLimit;
  private String inviteLink;
  private String profileUrl;

  @OneToMany(mappedBy = "team")
  private List<TeamParticipants> teamParticipants = new ArrayList<>();

  @OneToMany(mappedBy = "team")
  private List<Schedule> schedules = new ArrayList<>();

  @OneToMany(mappedBy = "team")
  private List<Documents> documents = new ArrayList<>();
}
