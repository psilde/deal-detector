package com.findadeal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.findadeal.user.UserRepository;
import com.findadeal.watchlist.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired WatchlistRepository watchlistRepository;

    @BeforeEach
    void cleanDb() {
        watchlistRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void noAuth401() throws Exception {
        mockMvc.perform(get("/watchlists"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidThreshold400() throws Exception {
        String token = registerAndGetToken("integration_" + System.nanoTime());

        mockMvc.perform(post("/watchlists")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"keyword":"rtx","percentageThreshold":95}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void getMatchesPayloadSuccessful() throws Exception {
        String token = registerAndGetToken("integration_" + System.currentTimeMillis());

        long id = createWatchlist(token, "rtx 4070 super", 10);

        mockMvc.perform(get("/watchlists/{id}/matches?page=0&size=20", id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keyword").value("rtx 4070 super"))
                .andExpect(jsonPath("$.percentageThreshold").value(10))
                .andExpect(jsonPath("$.totalMatchCount").exists())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.totalPages").exists())
                .andExpect(jsonPath("$.matches").isArray());
    }

    private String registerAndGetToken(String username) throws Exception {
        String body = """
            {"username":"%s","password":"password123"}
        """.formatted(username);

        String response = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    private long createWatchlist(String token, String keyword, int threshold) throws Exception {
        String body = """
            {"keyword":"%s","percentageThreshold":%d}
        """.formatted(keyword, threshold);

        String response = mockMvc.perform(post("/watchlists")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("id").asLong();
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
