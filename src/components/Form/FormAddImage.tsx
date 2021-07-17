import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type FormData = {
  url: string;
  title: string;
  description: string;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo de imagem é obrigatório',
      validate: {
        lessThan10MB: ({ '0': image }) => {
          const sizeInMB = image.size / 1024 / 1024;

          return sizeInMB < 10 || 'O arquivo deve ser menor que 10MB';
        },
        acceptedFormats: ({ '0': image }) => {
          const [match] = image.type.match(/image\/png|jpeg|git/);
          return (
            Boolean(match) ||
            'Somente são aceitos arquivos de imagens PNG, JPEG e GIF'
          );
        },
      },
    },
    title: {
      required: {
        message: 'Título obrigatório',
        value: true,
      },
      minLength: {
        message: 'Mínimo de 2 caracteres',
        value: 2,
      },
      maxLength: {
        message: 'Máximo de 20 caracteres',
        value: 20,
      },
    },
    description: {
      required: {
        message: 'Descrição obrigatória',
        value: true,
      },
      maxLength: {
        message: 'Máximo de 65 caracteres',
        value: 65,
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: FormData) => {
      await api.post('api/images', {
        ...image,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'info',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });
      }
      await mutation.mutateAsync(data);
      toast({
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem',
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
