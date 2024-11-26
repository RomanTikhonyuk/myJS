package com.example.bs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BsApplication.class, args);
//        ApplicationContext context = SpringApplication.run(BsApplication.class, args);
//		try {
//			UserService userService = context.getBean(UserService.class);
//			RoleService roleService = context.getBean(RoleService.class);
//
//			User user1 = new User(7l, "a1", "a1", "a1@mail.ru", "admin");
//			User user2 = new User("user", "user", 33, "user@mail.ru", "user");
//			User user3 = new User("ivan", "ivan", 40, "ivan@mail.ru", "ivan");
//
//			Role roleAdmin = new Role("ROLE_ADMIN");
//			Role roleUser = new Role("ROLE_USER");
//
//			List<Role> rolesAdmUs = new ArrayList<>();
//			rolesAdmUs.add(roleAdmin);
//			rolesAdmUs.add(roleUser);
//
//			List<Role> rolesUs = new ArrayList<>();
//			rolesUs.add(roleUser);
//
//			user1.setRoles(rolesAdmUs);
//			user2.setRoles(rolesUs);
//			user3.setRoles(rolesUs);
//
//			roleService.add(roleAdmin);
//			roleService.add(roleUser);
//
//			userService.addUser(user1);
//			userService.addUser(user2);
//			userService.addUser(user3);
//
//		} catch (Exception ignored) {
//		}
    }
}
