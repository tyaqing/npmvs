'use client'

import {
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function MyCombobox() {
  const bg = useColorModeValue('gray.100', 'gray.700')

  // 请求结果
  const [packageSearchResult, setPackageSearchResult] = useState<{ name: string }[]>([])
  const router = useRouter()
  const params = useParams()
  // 关键字
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (!query) {
      setPackageSearchResult([])
      return
    }
    const controller = new AbortController()
    const url = `https://api.npms.io/v2/search/suggestions?q=${query}&size=6`

    fetch(`/api/proxy?url=${url}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setPackageSearchResult(
          data.map((item: { package: { name: any } }) => {
            return {
              id: item.package.name,
              name: item.package.name,
            }
          }),
        )
      })
    return () => {
      controller.abort('cancel')
    }
  }, [query])

  //  Search
  const onChange = async (selected: string) => {
    console.log('selected', selected, params['slug'])
    const slug = params['slug'] as string

    const packages = (slug as string)?.split('-vs-')
    if (Array.isArray(packages) && packages.length) {
      // Deduplication
      if (packages.includes(selected)) return
      await router.push(slug + '-vs-' + selected)
    } else {
      await router.push('/' + selected)
    }
    setPackageSearchResult([])
  }

  return (
    <Popover matchWidth autoFocus={false} isOpen={!!packageSearchResult.length}>
      <PopoverTrigger>
        <InputGroup>
          <InputLeftElement>
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            colorScheme={'cyan'}
            value={query}
            onBlur={() => setQuery('')}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="e.g. react express"
          />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent width={'100%'}>
        <PopoverBody width={'100%'}>
          {packageSearchResult.map((item) => (
            <Text
              onMouseDown={() => onChange(item.name)}
              key={item.name}
              as={'div'}
              px="2"
              py="1.5"
              cursor={'pointer'}
              borderRadius="md"
              _hover={{
                textDecoration: 'none',
                bg,
              }}
            >
              {item.name}
            </Text>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
