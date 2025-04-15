import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
// import SearchBox from '';
import { useDebounce } from './useDebounce';
import CustomSearchBox from '.';

interface Fruit {
  id: number;
  name: string;
}

const allFruits: Fruit[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Mango' },
  { id: 4, name: 'Grapes' },
  { id: 5, name: 'Pineapple' },
];

const Uses = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(search, 400);

  useEffect(() => {
    if (debounced) {
      setLoading(true);
      setTimeout(() => {
        const filtered = allFruits.filter((fruit) =>
          fruit.name.toLowerCase().includes(debounced.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 500); // simulating API delay
    } else {
      setResults([]);
    }
  }, [debounced]);

  return (
    <Box p={4} maxWidth={400}>
      <CustomSearchBox
        value={search}
        onChange={setSearch}
        suggestions={results}
        getLabel={(item: { name: any; }) => item.name}
        onSelectSuggestion={(item: { name: any; }) => alert(`Selected: ${item.name}`)}
        isLoading={loading}
      />
    </Box>
  );
};

export default Uses;
