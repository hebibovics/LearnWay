package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Resource;
import unsa.ba.etf.learnway.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unsa.ba.etf.learnway.services.ResourceService;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    @Override
    public Resource updateResource(Long id, Resource updatedResource) {
        Optional<Resource> existing = resourceRepository.findById(id);
        if (existing.isPresent()) {
            Resource r = existing.get();
            r.setName(updatedResource.getName());
            r.setLicenseExpiry(updatedResource.getLicenseExpiry());
            r.setMaintenanceCost(updatedResource.getMaintenanceCost());
            return resourceRepository.save(r);
        } else {
            throw new RuntimeException("Resource not found with id " + id);
        }
    }
}
