package com.weatherforecasting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherResponse {
    @JsonProperty("coord")
    private Coord coord;

    @JsonProperty("weather")
    private List<Weather> weather;

    @JsonProperty("base")
    private String base;

    @JsonProperty("main")
    private Main main;

    @JsonProperty("visibility")
    private int visibility;

    @JsonProperty("wind")
    private Wind wind;

    @JsonProperty("clouds")
    private Clouds clouds;

    @JsonProperty("dt")
    private long dt;

    @JsonProperty("sys")
    private Sys sys;

    @JsonProperty("timezone")
    private int timezone;

    @JsonProperty("id")
    private int id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("cod")
    private int cod;

    // Getters and setters
    public Coord getCoord() { return coord; }
    public void setCoord(Coord coord) { this.coord = coord; }

    public List<Weather> getWeather() { return weather; }
    public void setWeather(List<Weather> weather) { this.weather = weather; }

    public String getBase() { return base; }
    public void setBase(String base) { this.base = base; }

    public Main getMain() { return main; }
    public void setMain(Main main) { this.main = main; }

    public int getVisibility() { return visibility; }
    public void setVisibility(int visibility) { this.visibility = visibility; }

    public Wind getWind() { return wind; }
    public void setWind(Wind wind) { this.wind = wind; }

    public Clouds getClouds() { return clouds; }
    public void setClouds(Clouds clouds) { this.clouds = clouds; }

    public long getDt() { return dt; }
    public void setDt(long dt) { this.dt = dt; }

    public Sys getSys() { return sys; }
    public void setSys(Sys sys) { this.sys = sys; }

    public int getTimezone() { return timezone; }
    public void setTimezone(int timezone) { this.timezone = timezone; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCod() { return cod; }
    public void setCod(int cod) { this.cod = cod; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Coord {
        @JsonProperty("lon")
        private double lon;
        @JsonProperty("lat")
        private double lat;

        public double getLon() { return lon; }
        public void setLon(double lon) { this.lon = lon; }
        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Weather {
        @JsonProperty("id")
        private int id;
        @JsonProperty("main")
        private String main;
        @JsonProperty("description")
        private String description;
        @JsonProperty("icon")
        private String icon;

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getMain() { return main; }
        public void setMain(String main) { this.main = main; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Main {
        @JsonProperty("temp")
        private double temp;
        @JsonProperty("feels_like")
        private double feelsLike;
        @JsonProperty("temp_min")
        private double tempMin;
        @JsonProperty("temp_max")
        private double tempMax;
        @JsonProperty("pressure")
        private int pressure;
        @JsonProperty("humidity")
        private int humidity;

        public double getTemp() { return temp; }
        public void setTemp(double temp) { this.temp = temp; }
        public double getFeelsLike() { return feelsLike; }
        public void setFeelsLike(double feelsLike) { this.feelsLike = feelsLike; }
        public double getTempMin() { return tempMin; }
        public void setTempMin(double tempMin) { this.tempMin = tempMin; }
        public double getTempMax() { return tempMax; }
        public void setTempMax(double tempMax) { this.tempMax = tempMax; }
        public int getPressure() { return pressure; }
        public void setPressure(int pressure) { this.pressure = pressure; }
        public int getHumidity() { return humidity; }
        public void setHumidity(int humidity) { this.humidity = humidity; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Wind {
        @JsonProperty("speed")
        private double speed;
        @JsonProperty("deg")
        private int deg;

        public double getSpeed() { return speed; }
        public void setSpeed(double speed) { this.speed = speed; }
        public int getDeg() { return deg; }
        public void setDeg(int deg) { this.deg = deg; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Clouds {
        @JsonProperty("all")
        private int all;

        public int getAll() { return all; }
        public void setAll(int all) { this.all = all; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Sys {
        @JsonProperty("type")
        private int type;
        @JsonProperty("id")
        private int id;
        @JsonProperty("country")
        private String country;
        @JsonProperty("sunrise")
        private long sunrise;
        @JsonProperty("sunset")
        private long sunset;

        public int getType() { return type; }
        public void setType(int type) { this.type = type; }
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
        public long getSunrise() { return sunrise; }
        public void setSunrise(long sunrise) { this.sunrise = sunrise; }
        public long getSunset() { return sunset; }
        public void setSunset(long sunset) { this.sunset = sunset; }
    }
}