
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { ArrowRight, FileSpreadsheet, Calculator, FileCheck, Boxes } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {t("appName")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t("home.tagline")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/simulation">
              <Button size="lg" className="bg-accent hover:bg-accent-dark">
                {t("home.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader className="pb-3">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{t("home.simulation.title")}</CardTitle>
              <CardDescription>
                {t("home.simulation.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>{t("home.simulation.feature1")}</li>
                <li>{t("home.simulation.feature2")}</li>
                <li>{t("home.simulation.feature3")}</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/simulation" className="w-full">
                <Button variant="outline" className="w-full">
                  {t("home.simulation.start")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{t("home.declaration.title")}</CardTitle>
              <CardDescription>
                {t("home.declaration.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>{t("home.declaration.feature1")}</li>
                <li>{t("home.declaration.feature2")}</li>
                <li>{t("home.declaration.feature3")}</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/declaration" className="w-full">
                <Button variant="outline" className="w-full">
                  {t("home.declaration.start")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{t("home.calculator.title")}</CardTitle>
              <CardDescription>
                {t("home.calculator.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>{t("home.calculator.feature1")}</li>
                <li>{t("home.calculator.feature2")}</li>
                <li>{t("home.calculator.feature3")}</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/calculator" className="w-full">
                <Button variant="outline" className="w-full">
                  {t("home.calculator.start")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
        
        <section className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            <Boxes className="inline mr-2 h-6 w-6" />
            {t("home.simplify.title")}
          </h2>
          <p className="text-gray-600">
            {t("home.simplify.desc")}
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
