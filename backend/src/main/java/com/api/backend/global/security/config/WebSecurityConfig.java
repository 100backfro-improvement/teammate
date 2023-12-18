package com.api.backend.global.security.config;

import com.api.backend.global.security.jwt.JwtAccessDeniedHandler;
import com.api.backend.global.security.jwt.JwtAuthenticationEntryPoint;
import com.api.backend.global.security.jwt.JwtAuthenticationFilter;
import com.api.backend.global.security.jwt.JwtTokenProvider;
import java.util.Collections;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

    @Value("${frontend.host}")
    String host;

    @Value("${frontend.port}")
    String port;

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    private static final String[] AUTH_WHITELIST = {
        "/swagger-resources/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/v2/api-docs",
        "/webjars/**",
        "/menus/**",
        "/h2-console/**",
        "/sign-in","/sign-up","/logout","/my-page","/member/password","/email-verify/**","/sign-up/email-check/**",
        "/ws"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        StringBuilder url= new StringBuilder();
        url.append("http://").append(host).append(":").append(port);
        http
                .httpBasic().disable()
                .csrf().disable()
                 .cors().and()
                .formLogin().disable()
                .logout().disable()
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint) //customEntryPoint
                .accessDeniedHandler(jwtAccessDeniedHandler) // cutomAccessDeniedHandler

                .and()
                .authorizeRequests() // 요청에 대한 권한 설정
                .antMatchers(AUTH_WHITELIST).permitAll()
                .antMatchers("/my-page","/member/password").authenticated()
                .anyRequest().authenticated();

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

}
