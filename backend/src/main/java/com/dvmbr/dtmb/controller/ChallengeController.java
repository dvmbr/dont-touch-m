package com.dvmbr.dtmb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChallengeController {

    @GetMapping("/001")
    public String challenge001() {
        return "challenge/001";
    }

}
