package ase.delivery.delivery.deliverymanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class DeliveryManagementApplication {

	@Bean
	public static RestTemplate getRestTemplate() {
		HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
		clientHttpRequestFactory.setConnectTimeout(5000);
		return new RestTemplate(clientHttpRequestFactory);
	}

	public static void main(String[] args) {
		SpringApplication.run(DeliveryManagementApplication.class, args);
	}

}
