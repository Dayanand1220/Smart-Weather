let mockSet = jest.fn();
let mockGet = jest.fn();

jest.mock('node-cache', () => {
  return jest.fn().mockImplementation(() => {
    return {
      set: mockSet,
      get: mockGet,
      close: jest.fn(),
    };
  });
});

const WeatherService = require('../services/weatherService');


// Mock global.fetch
global.fetch = jest.fn();

describe('WeatherService', () => {
  let weatherService;

  beforeEach(() => {
    process.env.OPENWEATHER_API_KEY = 'test_api_key';
    weatherService = require('../services/weatherService');
    jest.clearAllMocks();
  });

  it('should fetch weather data successfully and cache it', async () => {
    const mockWeatherResponse = {
      ok: true,
      json: () => Promise.resolve({
        name: 'London',
        main: { temp: 15.5, humidity: 80, pressure: 1012 },
        wind: { speed: 5.2 },
        sys: { sunrise: 1678886400, sunset: 1678933200 },
        weather: [{ description: 'clear sky', icon: '01d' }],
        coord: { lat: 51.5, lon: -0.1 },
      }),
    };
    const mockAqiResponse = {
      ok: true,
      json: () => Promise.resolve({
        list: [{
          main: { aqi: 2 }
        }]
      }),
    };

    fetch
      .mockImplementationOnce(() => Promise.resolve(mockWeatherResponse))
      .mockImplementationOnce(() => Promise.resolve(mockAqiResponse));

    mockGet.mockReturnValueOnce(undefined); // No cached data

    const result = await weatherService.getWeatherByCity('London');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toHaveProperty('cityName', 'London');
    expect(result).toHaveProperty('temperature');
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith('weather_london', expect.any(Object));
  });

  it('should return cached data if available', async () => {
    const cachedWeatherData = {
      cityName: 'London',
      temperature: 10,
      humidity: 70,
      windSpeed: 3,
      pressure: 1010,
      aqi: 1,
      sunrise: '2023-03-15T07:00:00.000Z',
      sunset: '2023-03-15T18:00:00.000Z',
      description: 'few clouds',
      icon: '02d'
    };
    mockGet.mockReturnValueOnce(cachedWeatherData);

    const result = await weatherService.getWeatherByCity('London');

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual(cachedWeatherData);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should handle city not found error', async () => {
    const mockWeatherResponse = {
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'city not found' }),
    };

    fetch.mockImplementationOnce(() => Promise.resolve(mockWeatherResponse));

    await expect(weatherService.getWeatherByCity('NonExistentCity')).rejects.toEqual({
      code: 'CITY_NOT_FOUND',
      message: 'City not found. Please check the spelling and try again.',
      details: 'City not found in OpenWeatherMap database',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should handle API key error', async () => {
    const mockWeatherResponse = {
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid API key' }),
    };

    fetch.mockImplementationOnce(() => Promise.resolve(mockWeatherResponse));

    await expect(weatherService.getWeatherByCity('London')).rejects.toEqual({
      code: 'INVALID_API_KEY',
      message: 'Server configuration error. Please contact support.',
      details: 'Invalid OpenWeatherMap API key',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should handle network error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network failure')));

    await expect(weatherService.getWeatherByCity('London')).rejects.toEqual({
      code: 'NETWORK_ERROR',
      message: 'Unable to fetch weather data. Please check your internet connection.',
      details: 'Network failure',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });
});
