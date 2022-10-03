package com.example.datego.service;

import com.example.datego.dto.req.ReviewReq;
import com.example.datego.http.ApiResponse;
import com.example.datego.repository.*;
import com.example.datego.vo.ReviewVO;
import com.example.datego.vo.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final TagRepository tagRepository;

    private final Spot_TagRepository spot_tagRepository;

    private final SpotRepository spotRepository;

    private final UserRepository userRepository;

    private final User_SpotRepository user_spotRepository;

    @Transactional
    public ApiResponse getReviews(int spotId){
        ApiResponse apiResponse = new ApiResponse();
        List<Spot_Tag> spot_tags = spot_tagRepository.findBySpotId(spotId);
        List<ReviewVO> reviews = new ArrayList<>();
        for (int i = 0; i < spot_tags.size(); i++) {
            Tag tempTag = spot_tags.get(i).getTag();
            ReviewVO tempReview = ReviewVO.builder()
                    .id(tempTag.getId())
                    .name(tempTag.getName())
                    .build();
            reviews.add(tempReview);
        }
        apiResponse.setResponseData(reviews);
        return apiResponse;
    }

    @Transactional
    public ApiResponse postReviews(int spotId, ReviewReq reviewReq, int userId){
        ApiResponse apiResponse = new ApiResponse();
        List<Integer> reviewIds = reviewReq.getReviewIds();

        for(int reviewId : reviewIds){
            Spot_Tag spot_tag = spot_tagRepository.findBySpotIdAndTagId(spotId, reviewId);
            spot_tag.addCount();
            spot_tagRepository.save(spot_tag);

            Tag tag = tagRepository.findById(reviewId);
            tag.addCount();
            tagRepository.save(tag);
        }

        Spot spot = spotRepository.findSpotById(spotId);
        spot.addRate(reviewReq.getRate());
        spot.addCount();
        spotRepository.save(spot);

        User_Spot user_spot = User_Spot.builder()
                .user(userRepository.findById(userId).get())
                .spot(spot)
                .rate(reviewReq.getRate())
                .createdAt(LocalDateTime.now())
                .build();

        user_spotRepository.save(user_spot);

        return apiResponse;
    }
}
