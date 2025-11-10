import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-none px-4 md:px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Uconia LPS Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive Last Planning System metrics and visualizations for construction project management
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button 
                onClick={() => navigate("/dashboard")} 
                size="lg" 
                className="text-lg"
              >
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                <CardTitle>Plan Complete</CardTitle>
                <CardDescription>
                  Track weekly work plan completion percentage and progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <AlertCircle className="h-12 w-12 text-warning mb-4" />
                <CardTitle>Variance Tracking</CardTitle>
                <CardDescription>
                  Log and analyze reasons for delays and task variances
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-destructive mb-4" />
                <CardTitle>Constraints Analysis</CardTitle>
                <CardDescription>
                  Monitor constraints by location and identify constraint-free tasks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Progress Metrics</CardTitle>
                <CardDescription>
                  Compare planned vs actual progress across all activities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="mt-16 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Dashboard Features</CardTitle>
              <CardDescription>Everything you need for effective project tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Weekly Reporting</h3>
                  <p className="text-sm text-muted-foreground">
                    Meet sub-contractor obligations with automated weekly reports including spent resources, earned resources, progress, and constraints.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Interactive Visualizations</h3>
                  <p className="text-sm text-muted-foreground">
                    Stratify data by location, owner, and other metadata to identify patterns and trends across your project.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Historical Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    View previous weeks to identify trends and improve future work completion rates.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Export Capabilities</h3>
                  <p className="text-sm text-muted-foreground">
                    Export dashboards and reports to fulfill contractual obligations to main contractors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
