package com.api.backend.category.data.dto;

import com.api.backend.category.type.CategoryType;
import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class ScheduleCategoryRequest {

  @NotNull(message = "teamId는 필수 값입니다.")
  @Schema(description = "team id", example = "1L")
  private Long teamId;

  @NotNull(message = "createTeamParticipantId는 필수 값입니다.")
  @Schema(description = "create team participant id", example = "1L")
  private Long createTeamParticipantId;

  @NotBlank(message = "카테고리명을 입력해주세요.")
  @Schema(description = "category name", example = "회의")
  private String categoryName;

  @NotBlank(message = "카테고리 유형을 선택해주세요.")
  @Schema(description = "category type", example = "DOCUMENTS")
  private CategoryType categoryType;

  @Schema(description = "color", example = "#ff0000")
  private String color;
}
