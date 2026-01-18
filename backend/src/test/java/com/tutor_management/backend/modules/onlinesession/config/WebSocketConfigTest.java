package com.tutor_management.backend.modules.onlinesession.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.TestPropertySource;

import org.springframework.web.socket.config.annotation.DelegatingWebSocketMessageBrokerConfiguration;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = {
    WebSocketConfig.class,
    DelegatingWebSocketMessageBrokerConfiguration.class
})
@TestPropertySource(properties = {
    "app.online-session.websocket.allowed-origins=http://localhost:3000"
})
class WebSocketConfigTest {

    @Autowired(required = false)
    private WebSocketConfig webSocketConfig;

    @Test
    @DisplayName("Should load WebSocketConfig bean")
    void contextLoads() {
        assertNotNull(webSocketConfig, "WebSocketConfig should be loaded as a bean");
    }
}
