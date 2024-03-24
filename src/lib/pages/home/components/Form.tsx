import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { OptionProps } from 'chakra-react-select';
import { Select, chakraComponents } from 'chakra-react-select';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { BiCheck, BiPlus } from 'react-icons/bi';

type Form = {
  firstName: string;
  lastName: string;
  gender: { label: string; value: string };
  dateOfBirth: string;
  techStack: { value: string; index: number }[];
  email: string;
  phoneNumber: string;
};

const requiredMessage = 'This is required';

const customComponents = {
  Option: ({ children, ...props }: OptionProps<Form['gender']>) => (
    <chakraComponents.Option {...props}>
      <Text color="black">{children}</Text>
      {props.isSelected && (
        <BiCheck color="teal" size={24} style={{ marginLeft: 'auto' }} />
      )}
    </chakraComponents.Option>
  ),
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export default function HookForm() {
  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Form>({
    defaultValues: { techStack: [{ value: '', index: 0 }] },
  });

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'techStack', // unique name for your Field Array
  });

  function onSubmit(values: Form) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(values);
      }, 3000);
    });
  }

  const getTextContent = (
    value: Form['gender'] | Form['techStack'] | Form['firstName']
  ) => {
    let textContent = '';
    if (typeof value === 'string') {
      textContent = value;
    } else if (Array.isArray(value)) {
      textContent = value.map((i) => i.value).join(', ');
    } else if (value?.value) {
      textContent = value.value;
    }
    return textContent;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <FormControl isInvalid={Boolean(errors.firstName)}>
            <FormLabel htmlFor="name">First name</FormLabel>
            <Input
              id="firstName"
              placeholder="first name"
              {...register('firstName', {
                required: requiredMessage,
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
            />
            <FormErrorMessage>
              {errors.firstName && errors.firstName.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.lastName)}>
            <FormLabel htmlFor="name">Last name</FormLabel>
            <Input
              id="lastName"
              placeholder="last name"
              {...register('lastName', {
                required: requiredMessage,
              })}
            />
            <FormErrorMessage>
              {errors.lastName && errors.lastName.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel htmlFor="name">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="email"
              {...register('email', {
                required: requiredMessage,
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.phoneNumber)}>
            <FormLabel htmlFor="name">Phone Number</FormLabel>
            <InputGroup>
              <InputLeftAddon>+91</InputLeftAddon>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="phone number"
                {...register('phoneNumber', {
                  required: requiredMessage,
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Phone number format is incorrect',
                  },
                })}
              />
            </InputGroup>

            <FormErrorMessage>
              {errors.phoneNumber && errors.phoneNumber.message}
            </FormErrorMessage>
          </FormControl>
          <Controller
            control={control}
            name="gender"
            rules={{ required: requiredMessage }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error },
            }) => (
              <FormControl isInvalid={Boolean(error)}>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Select
                  id="gender"
                  placeholder="Select gender"
                  selectedOptionColorScheme="white"
                  components={customComponents}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  name={name}
                  value={value}
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                />

                <FormErrorMessage>
                  {errors.gender && errors.gender.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />

          <FormControl isInvalid={Boolean(errors.dateOfBirth)}>
            <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth', { required: requiredMessage })}
            />
            <FormErrorMessage>
              {errors.dateOfBirth && errors.dateOfBirth.message}
            </FormErrorMessage>
          </FormControl>

          <Flex direction="column" width="100%">
            <Flex justify="space-between" width="100%" alignItems="center">
              <FormLabel htmlFor="techStack">Tech Stack</FormLabel>
              <IconButton
                aria-label="add"
                size="sm"
                mb={2}
                onClick={() => prepend({ value: '', index: 0 })}
                type="button"
              >
                <BiPlus size={18} />
              </IconButton>
            </Flex>
            {fields.map((field, index) => (
              <FormControl
                isInvalid={Boolean(
                  errors.techStack && errors.techStack[index]?.value
                )}
              >
                <InputGroup id={field.id}>
                  <Input
                    id={`techStack-${index}`}
                    placeholder="Tech Stack"
                    {...register(`techStack.${index}.value`, {
                      required: requiredMessage,
                    })}
                  />

                  {index > 0 && (
                    <InputRightElement>
                      <CloseButton
                        aria-label="remove"
                        onClick={() => remove(index)}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                <FormErrorMessage>
                  {errors.techStack &&
                    errors.techStack[index]?.value &&
                    errors.techStack[index]?.value?.message}
                </FormErrorMessage>
              </FormControl>
            ))}
          </Flex>

          <Button
            mt={4}
            colorScheme="teal"
            width="100%"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </VStack>
      </form>
      {isSubmitSuccessful && (
        <Flex direction="column">
          {(Object.entries(getValues()) as Entries<Form>).map(
            ([key, value]) => (
              <Flex>
                <Text fontWeight="bold">{key}:&nbsp;</Text>
                <Text>{getTextContent(value)}</Text>
              </Flex>
            )
          )}
        </Flex>
      )}
    </>
  );
}
