package com.project.sofex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.project.sofex.model.User;
import com.project.sofex.model.Role;
import com.project.sofex.repository.UserRepository;
import com.project.sofex.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;

@SpringBootApplication
public class SofexApplication {

	public static void main(String[] args) {
		SpringApplication.run(SofexApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Create roles if not exist
			Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
				Role r = new Role(); r.setName("ADMIN"); return roleRepository.save(r);
			});
			Role salesRole = roleRepository.findByName("SALES").orElseGet(() -> {
				Role r = new Role(); r.setName("SALES"); return roleRepository.save(r);
			});
			Role reportRole = roleRepository.findByName("REPORT").orElseGet(() -> {
				Role r = new Role(); r.setName("REPORT"); return roleRepository.save(r);
			});

			// Create admin user
			if (userRepository.findByUsername("admin").isEmpty()) {
				User user = new User();
				user.setUsername("admin");
				user.setPassword(passwordEncoder.encode("admin"));
				user.setEmail("admin@example.com");
				user.setFirstName("Admin");
				user.setLastName("User");
				user.setRoles(Set.of(adminRole));
				userRepository.save(user);
			}

			// Create sales user
			if (userRepository.findByUsername("sales").isEmpty()) {
				User user = new User();
				user.setUsername("sales");
				user.setPassword(passwordEncoder.encode("sale"));
				user.setEmail("sales@example.com");
				user.setFirstName("Sales");
				user.setLastName("User");
				user.setRoles(Set.of(salesRole));
				userRepository.save(user);
			}

			// Create reporter user
			if (userRepository.findByUsername("reporter").isEmpty()) {
				User user = new User();
				user.setUsername("reporter");
				user.setPassword(passwordEncoder.encode("reporter"));
				user.setEmail("reporter@example.com");
				user.setFirstName("Report");
				user.setLastName("User");
				user.setRoles(Set.of(reportRole));
				userRepository.save(user);
			}
		};
	}

}
