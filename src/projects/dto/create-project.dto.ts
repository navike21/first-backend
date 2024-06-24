import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DescriptionValueLength', async: false })
class DescriptionValueLengthValidator implements ValidatorConstraintInterface {
  validate(description: Record<string, string>): boolean {
    return Object.values(description).every(
      value => typeof value === 'string' && value.length <= 300,
    );
  }

  defaultMessage(): string {
    return 'Each value in the description must not exceed 10 characters.';
  }
}
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmptyObject()
  @IsObject()
  @Validate(DescriptionValueLengthValidator)
  description: Record<string, string>;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  projectUrl: string;

  @IsArray()
  @ArrayNotEmpty()
  technologies: string[];

  @IsArray()
  @ArrayNotEmpty()
  categories: string[];
}
