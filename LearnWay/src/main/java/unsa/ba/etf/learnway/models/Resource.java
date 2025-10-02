package unsa.ba.etf.learnway.models;

import javax.persistence.*;


@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String licenseExpiry;
    private Double maintenanceCost;

    public Resource() {}

    public Resource(String name, String licenseExpiry, Double maintenanceCost) {
        this.name = name;
        this.licenseExpiry = licenseExpiry;
        this.maintenanceCost = maintenanceCost;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(String licenseExpiry) { this.licenseExpiry = licenseExpiry; }

    public Double getMaintenanceCost() { return maintenanceCost; }
    public void setMaintenanceCost(Double maintenanceCost) { this.maintenanceCost = maintenanceCost; }
}
