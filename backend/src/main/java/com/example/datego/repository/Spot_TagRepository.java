package com.example.datego.repository;

import com.example.datego.vo.entity.Spot_Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Spot_TagRepository extends JpaRepository<Spot_Tag, Integer> {
    List<Spot_Tag> findBySpotId(int spotId);
    Spot_Tag findBySpotIdAndTagId(int spotId, int tagId);

    List<Spot_Tag> findTop3BySpotIdOrderByCountDesc(int spotId);
    List<Spot_Tag> findTop5BySpotIdOrderByCountDesc(int spotId);
}
