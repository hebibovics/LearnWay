package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Resource;
import java.util.List;

public interface ResourceService {
    List<Resource> getAllResources();
    Resource addResource(Resource resource);
    Resource updateResource(Long id, Resource resource);
}
