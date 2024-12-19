//package com.example.bs.controllers;
//
//import com.example.bs.models.Role;
//import com.example.bs.models.User;
//import com.example.bs.service.RoleService;
//import com.example.bs.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.servlet.ModelAndView;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Controller
//public class NewController {
//
//    private final UserService userService;
//    private final RoleService roleService;
//
//    @Autowired
//    public NewController(UserService userService, RoleService roleService) {
//        this.userService = userService;
//        this.roleService = roleService;
//    }
//
//    @GetMapping("/admin2")
//    @PreAuthorize("hasRole('admin')")
//    public String findAll(ModelAndView mav, Model model, Authentication authentication) {
//        List<User> users = userService.readAllUsers();
//        User user = new User();
//        model.addAttribute("users", users);
//        model.addAttribute("createUsers", user);
//        List<Role> roles = roleService.findAll();
//        model.addAttribute("allRoles", roles);
//        model.addAttribute("curUsersRoles", authentication.getAuthorities().stream().map(r-> r.getAuthority()).collect(Collectors.toList()));
//        return "admin_page";
//    }
//
//    @GetMapping("/user2")
//    public String showUserPage() {
//        return "user_page";
//    }
//
//}