package com.findadeal.model;

public class Listing {
    private String title;
    private double price;
    private String url;

    public Listing() { }

    public Listing(String title, double price, String url) {
        this.title = title;
        this.price = price;
        this.url = url;
    }

    public String getTitle() { return title; }
    public double getPrice() { return price; }
    public String getUrl() { return url; }

    public void setTitle(String title) { this.title = title; }
    public void setPrice(double price) { this.price = price; }
    public void setUrl(String url) { this.url = url; }
}
