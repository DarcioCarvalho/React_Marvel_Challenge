import styles from './styles.module.scss';

interface SearchProps {
  placeholder?: string,
  name: string,
  value?: string,
  onBlur: (event: any) => void
}

export function Search({ placeholder, name, value, onBlur }: SearchProps) {
  return (
    <input
      placeholder={placeholder}
      className={styles.searchContainer}
      type='text'
      name={name}
      onBlur={onBlur}
      value={value}
    />
  );
}