import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'src/schemas/profile.schema';
import { User } from 'src/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile = await this.profileModel.findOne({
      user: userId,
    });

    return {
      message: 'Profile has been found successfully',
      data: {
        email: user.email,
        username: user.username,
        name: profile?.name,
        birthday: profile?.birthday,
        horoscope: profile?.horoscope,
        zodiac: profile?.zodiac,
        height: profile?.height,
        weight: profile?.weight,
        interests: profile?.interests,
      },
    };
  }
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User Profile not found', HttpStatus.NOT_FOUND);
    }

    let profile = await this.profileModel.findOneAndUpdate(
      {
        user: userId,
      },
      {
        name: updateProfileDto.name,
        birthday: updateProfileDto.birthday,
        horoscope: this.getHoroscope(updateProfileDto.birthday),
        zodiac: this.getZodiac(updateProfileDto.birthday),
        height: updateProfileDto.height,
        weight: updateProfileDto.weight,
        interests: updateProfileDto.interests,
      },
    );

    if (!profile) {
      profile = await this.profileModel.create({
        user: userId,
        name: updateProfileDto.name,
        birthday: updateProfileDto.birthday,
        horoscope: this.getHoroscope(updateProfileDto.birthday),
        zodiac: this.getZodiac(updateProfileDto.birthday),
        height: updateProfileDto.height,
        weight: updateProfileDto.weight,
        interests: updateProfileDto.interests,
      });
    }

    return {
      message: 'Profile has been updated successfully',
      data: {
        email: user.email,
        username: user.username,
        name: profile.name,
        birthday: profile.birthday,
        horoscope: profile.horoscope,
        zodiac: profile.zodiac,
        height: profile.height,
        weight: profile.weight,
        interests: profile.interests,
      },
    };
  }

  getHoroscope(birthday: string) {
    const [month, day] = birthday.split('-').slice(1).map(Number);
    const horoscopes = {
      Aquarius: (month === 1 && day >= 20) || (month === 2 && day <= 18),
      Pisces: (month === 2 && day >= 19) || (month === 3 && day <= 20),
      Aries: (month === 3 && day >= 21) || (month === 4 && day <= 19),
      Taurus: (month === 4 && day >= 20) || (month === 5 && day <= 20),
      Gemini: (month === 5 && day >= 21) || (month === 6 && day <= 20),
      Cancer: (month === 6 && day >= 21) || (month === 7 && day <= 22),
      Leo: (month === 7 && day >= 23) || (month === 8 && day <= 22),
      Virgo: (month === 8 && day >= 23) || (month === 9 && day <= 22),
      Libra: (month === 9 && day >= 23) || (month === 10 && day <= 22),
      Scorpio: (month === 10 && day >= 23) || (month === 11 && day <= 21),
      Sagittarius: (month === 11 && day >= 22) || (month === 12 && day <= 21),
      Capricorn: (month === 12 && day >= 22) || (month === 1 && day <= 19),
    };

    return Object.keys(horoscopes).find((key) => horoscopes[key]) ?? 'Error';
  }

  getZodiac(birthday: string) {
    const zodiacData = [
      { zodiac: 'Rat', start: '1912-02-18', end: '1913-02-05' },
      { zodiac: 'Ox', start: '1913-02-06', end: '1914-01-25' },
      { zodiac: 'Tiger', start: '1914-01-26', end: '1915-02-13' },
      { zodiac: 'Rabbit', start: '1915-02-14', end: '1916-02-02' },
      { zodiac: 'Dragon', start: '1916-02-03', end: '1917-01-22' },
      { zodiac: 'Snake', start: '1917-01-23', end: '1918-02-10' },
      { zodiac: 'Horse', start: '1918-02-11', end: '1919-01-31' },
      { zodiac: 'Goat', start: '1919-02-01', end: '1920-02-19' },
      { zodiac: 'Monkey', start: '1920-02-20', end: '1921-02-07' },
      { zodiac: 'Rooster', start: '1921-02-08', end: '1922-01-27' },
      { zodiac: 'Dog', start: '1922-01-28', end: '1923-02-15' },
      { zodiac: 'Pig', start: '1923-02-16', end: '1924-02-04' },
      { zodiac: 'Rat', start: '1924-02-05', end: '1925-01-24' },
      { zodiac: 'Ox', start: '1925-01-25', end: '1926-02-12' },
      { zodiac: 'Tiger', start: '1926-02-13', end: '1927-02-01' },
      { zodiac: 'Rabbit', start: '1927-02-02', end: '1928-01-22' },
      { zodiac: 'Dragon', start: '1928-01-23', end: '1929-02-09' },
      { zodiac: 'Snake', start: '1929-02-10', end: '1930-01-29' },
      { zodiac: 'Horse', start: '1930-01-30', end: '1931-02-16' },
      { zodiac: 'Goat', start: '1931-02-17', end: '1932-02-05' },
      { zodiac: 'Monkey', start: '1932-02-06', end: '1933-01-25' },
      { zodiac: 'Rooster', start: '1933-01-26', end: '1934-02-13' },
      { zodiac: 'Dog', start: '1934-02-14', end: '1935-02-03' },
      { zodiac: 'Pig', start: '1935-02-04', end: '1936-01-23' },
      { zodiac: 'Rat', start: '1936-01-24', end: '1937-02-10' },
      { zodiac: 'Ox', start: '1937-02-11', end: '1938-01-30' },
      { zodiac: 'Tiger', start: '1938-01-31', end: '1939-02-18' },
      { zodiac: 'Rabbit', start: '1939-02-19', end: '1940-02-07' },
      { zodiac: 'Dragon', start: '1940-02-08', end: '1941-01-26' },
      { zodiac: 'Snake', start: '1941-01-27', end: '1942-02-14' },
      { zodiac: 'Horse', start: '1942-02-15', end: '1943-02-04' },
      { zodiac: 'Goat', start: '1943-02-05', end: '1944-01-24' },
      { zodiac: 'Monkey', start: '1944-01-25', end: '1945-02-12' },
      { zodiac: 'Rooster', start: '1945-02-13', end: '1946-02-01' },
      { zodiac: 'Dog', start: '1946-02-02', end: '1947-01-21' },
      { zodiac: 'Pig', start: '1947-01-22', end: '1948-02-09' },
      { zodiac: 'Rat', start: '1948-02-10', end: '1949-01-28' },
      { zodiac: 'Ox', start: '1949-01-29', end: '1950-02-16' },
      { zodiac: 'Tiger', start: '1950-02-17', end: '1951-02-05' },
      { zodiac: 'Rabbit', start: '1951-02-06', end: '1952-01-26' },
      { zodiac: 'Dragon', start: '1952-01-27', end: '1953-02-13' },
      { zodiac: 'Snake', start: '1953-02-14', end: '1954-02-02' },
      { zodiac: 'Horse', start: '1954-02-03', end: '1955-01-23' },
      { zodiac: 'Goat', start: '1955-01-24', end: '1956-02-11' },
      { zodiac: 'Monkey', start: '1956-02-12', end: '1957-01-30' },
      { zodiac: 'Rooster', start: '1957-01-31', end: '1958-02-17' },
      { zodiac: 'Dog', start: '1958-02-18', end: '1959-02-07' },
      { zodiac: 'Pig', start: '1959-02-08', end: '1960-01-27' },
      { zodiac: 'Rat', start: '1960-01-28', end: '1961-02-14' },
      { zodiac: 'Ox', start: '1961-02-15', end: '1962-02-04' },
      { zodiac: 'Tiger', start: '1962-02-05', end: '1963-01-24' },
      { zodiac: 'Rabbit', start: '1963-01-25', end: '1964-02-12' },
      { zodiac: 'Dragon', start: '1964-02-13', end: '1965-02-01' },
      { zodiac: 'Snake', start: '1965-02-02', end: '1966-01-20' },
      { zodiac: 'Horse', start: '1966-01-21', end: '1967-02-08' },
      { zodiac: 'Goat', start: '1967-02-09', end: '1968-01-29' },
      { zodiac: 'Monkey', start: '1968-01-30', end: '1969-02-16' },
      { zodiac: 'Rooster', start: '1969-02-17', end: '1970-02-05' },
      { zodiac: 'Dog', start: '1970-02-06', end: '1971-01-26' },
      { zodiac: 'Pig', start: '1971-01-27', end: '1972-02-14' },
      { zodiac: 'Rat', start: '1972-02-15', end: '1973-02-02' },
      { zodiac: 'Ox', start: '1973-02-03', end: '1974-01-22' },
      { zodiac: 'Tiger', start: '1974-01-23', end: '1975-02-10' },
      { zodiac: 'Rabbit', start: '1975-02-11', end: '1976-01-30' },
      { zodiac: 'Dragon', start: '1976-01-31', end: '1977-02-17' },
      { zodiac: 'Snake', start: '1977-02-18', end: '1978-02-06' },
      { zodiac: 'Horse', start: '1978-02-07', end: '1979-01-27' },
      { zodiac: 'Goat', start: '1979-01-28', end: '1980-02-15' },
      { zodiac: 'Monkey', start: '1980-02-16', end: '1981-02-04' },
      { zodiac: 'Rooster', start: '1981-02-05', end: '1982-01-24' },
      { zodiac: 'Dog', start: '1982-01-25', end: '1983-02-12' },
      { zodiac: 'Pig', start: '1983-02-13', end: '1984-02-01' },
      { zodiac: 'Rat', start: '1984-02-02', end: '1985-02-19' },
      { zodiac: 'Ox', start: '1985-02-20', end: '1986-02-08' },
      { zodiac: 'Tiger', start: '1986-02-09', end: '1987-01-28' },
      { zodiac: 'Rabbit', start: '1987-01-29', end: '1988-02-16' },
      { zodiac: 'Dragon', start: '1988-02-17', end: '1989-02-05' },
      { zodiac: 'Snake', start: '1989-02-06', end: '1990-01-26' },
      { zodiac: 'Horse', start: '1990-01-27', end: '1991-02-14' },
      { zodiac: 'Goat', start: '1991-02-15', end: '1992-02-03' },
      { zodiac: 'Monkey', start: '1992-02-04', end: '1993-01-22' },
      { zodiac: 'Rooster', start: '1993-01-23', end: '1994-02-09' },
      { zodiac: 'Dog', start: '1994-02-10', end: '1995-01-30' },
      { zodiac: 'Pig', start: '1995-01-31', end: '1996-02-18' },
      { zodiac: 'Rat', start: '1996-02-19', end: '1997-02-06' },
      { zodiac: 'Ox', start: '1997-02-07', end: '1998-01-27' },
      { zodiac: 'Tiger', start: '1998-01-28', end: '1999-02-15' },
      { zodiac: 'Rabbit', start: '1999-02-16', end: '2000-02-04' },
      { zodiac: 'Dragon', start: '2000-02-05', end: '2001-01-23' },
      { zodiac: 'Snake', start: '2001-01-24', end: '2002-02-11' },
      { zodiac: 'Horse', start: '2002-02-12', end: '2003-01-31' },
      { zodiac: 'Goat', start: '2003-02-01', end: '2004-01-21' },
      { zodiac: 'Monkey', start: '2004-01-22', end: '2005-02-08' },
      { zodiac: 'Rooster', start: '2005-02-09', end: '2006-01-28' },
      { zodiac: 'Dog', start: '2006-01-29', end: '2007-02-17' },
      { zodiac: 'Pig', start: '2007-02-18', end: '2008-02-06' },
      { zodiac: 'Rat', start: '2008-02-07', end: '2009-01-25' },
      { zodiac: 'Ox', start: '2009-01-26', end: '2010-02-13' },
      { zodiac: 'Tiger', start: '2010-02-14', end: '2011-02-02' },
      { zodiac: 'Rabbit', start: '2011-02-03', end: '2012-01-22' },
      { zodiac: 'Dragon', start: '2012-01-23', end: '2013-02-09' },
      { zodiac: 'Snake', start: '2013-02-10', end: '2014-01-30' },
      { zodiac: 'Horse', start: '2014-01-31', end: '2015-02-18' },
      { zodiac: 'Goat', start: '2015-02-19', end: '2016-02-07' },
      { zodiac: 'Monkey', start: '2016-02-08', end: '2017-01-27' },
      { zodiac: 'Rooster', start: '2017-01-28', end: '2018-02-15' },
      { zodiac: 'Dog', start: '2018-02-16', end: '2019-02-04' },
      { zodiac: 'Pig', start: '2019-02-05', end: '2020-01-24' },
      { zodiac: 'Rat', start: '2020-01-25', end: '2021-01-24' },
      { zodiac: 'Ox', start: '2021-01-24', end: '2022-01-31' },
      { zodiac: 'Tiger', start: '2022-02-01', end: '2023-01-21' },
      { zodiac: 'Rabbit', start: '2023-01-22', end: '2024-02-09' },
    ];

    const inputDate = new Date(birthday);

    for (const data of zodiacData) {
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);

      if (inputDate >= startDate && inputDate <= endDate) {
        return data.zodiac;
      }
    }
    return 'Error';
  }
}
