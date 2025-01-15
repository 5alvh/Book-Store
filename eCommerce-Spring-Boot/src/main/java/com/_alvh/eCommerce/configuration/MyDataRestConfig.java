package com._alvh.eCommerce.configuration;

import com._alvh.eCommerce.entity.Product;
import com._alvh.eCommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions));
    }
}
