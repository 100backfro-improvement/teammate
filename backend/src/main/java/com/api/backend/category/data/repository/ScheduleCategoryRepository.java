package com.api.backend.category.data.repository;

import com.api.backend.category.data.entity.ScheduleCategory;
import com.api.backend.category.type.CategoryType;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleCategoryRepository extends JpaRepository<ScheduleCategory, Long> {
  Page<ScheduleCategory> findAllByCategoryType(CategoryType categoryType, Pageable pageable);
}
