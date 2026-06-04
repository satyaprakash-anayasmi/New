package com.example.documentmanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardController {

    @GetMapping(value = "{path:[^\\.]*}")
    public String redirect() {
        // Forward to home page so that Angular routing can take over
        return "forward:/";
    }
}
