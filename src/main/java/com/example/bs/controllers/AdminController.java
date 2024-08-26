package com.example.bs.controllers;

import com.example.bs.models.User;
import com.example.bs.service.RoleService;
import com.example.bs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String readAllUsers(Model model) {
        model.addAttribute("users", userService.readAllUsers());
        return "admin_page2";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.findAll());
        return "create";
    }

    @PostMapping("/createuser")
    public String createUser(@ModelAttribute("user")  User user,
                             BindingResult bindingResult, @RequestParam("role") String selectedRole) {
        if (bindingResult.hasErrors()) {
            return "create";
        }
        if (selectedRole.equals("ROLE_USER")) {
            user.setAuthorities(roleService.findByUsername("ROLE_USER"));
        } else if (selectedRole.equals("ROLE_ADMIN")) {
            user.setAuthorities(roleService.findAll());
        }
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/delete")
    public String delete(Model model, @RequestParam("id") Long id) {
        model.addAttribute(userService.readUserById(id));
        return "delete";
    }

    @PostMapping("/deleteuser")
    public String deleteUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @GetMapping("/update")
    public String update(Model model,
                         @RequestParam("id") Long id) {
        model.addAttribute(userService.readUserById(id));
        return "update";
    }

    @PostMapping("/updateuser")
    public String updateUser(@ModelAttribute("user")  User user,
                             BindingResult bindingResult,
                             @RequestParam("role") String selectedRole,
                             @RequestParam("id") Long id) {
        if (bindingResult.hasErrors()) {
            return "update";
        }
        if (selectedRole.equals("ROLE_USER")) {
            user.setAuthorities(roleService.findByUsername("ROLE_USER"));
        } else if (selectedRole.equals("ROLE_ADMIN")) {
            user.setAuthorities(roleService.findAll());
        }
        userService.updateUser(id, user);
        return "redirect:/admin";
    }
}