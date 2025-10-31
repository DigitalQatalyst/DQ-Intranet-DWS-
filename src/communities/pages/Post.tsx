import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Card, CardContent } from '@/communities/components/ui/card';
export default function Post() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  return <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Post Page</h1>
            <p className="text-muted-foreground">Post ID: {id}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This page is a placeholder. Full post details will be implemented
              next.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>;
}