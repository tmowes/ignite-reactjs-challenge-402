import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardData, CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type ImagesResponse = {
  after?: {
    id: string;
  };
  data: CardData[];
};

export default function Home(): JSX.Element {
  const loadImages = async ({ pageParam = null }): Promise<ImagesResponse> => {
    const { data } = await api.get<ImagesResponse>('api/images', {
      params: { after: pageParam },
    });
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', loadImages, {
    getNextPageParam: ({ after }) => after ?? null,
  });

  const formattedData = useMemo(
    () => data?.pages?.flatMap(page => page.data),
    [data]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            mt={8}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
