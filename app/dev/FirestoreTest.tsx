'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '../../services/categoryService';

export default function FirestoreTest() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Category List</h2>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
    </div>
  );
}
