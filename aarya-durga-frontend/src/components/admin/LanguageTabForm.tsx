import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LanguageTabFormProps {
  children: (language: 'en' | 'hi' | 'mr') => React.ReactNode;
  defaultValue?: 'en' | 'hi' | 'mr';
}

export const LanguageTabForm = ({ children, defaultValue = 'en' }: LanguageTabFormProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="hi">हिंदी</TabsTrigger>
        <TabsTrigger value="mr">मराठी</TabsTrigger>
      </TabsList>
      <TabsContent value="en" className="space-y-4">
        {children('en')}
      </TabsContent>
      <TabsContent value="hi" className="space-y-4">
        {children('hi')}
      </TabsContent>
      <TabsContent value="mr" className="space-y-4">
        {children('mr')}
      </TabsContent>
    </Tabs>
  );
};
