#include<iostream>
using namespace std;

class Processor
{
    string brand;
    int speed;
public:
    Processor(string b, int s)
    {
        brand = b;
        speed = s;
        cout << "Processor created: " << brand << endl;
    }

    void showProcessor()
    {
        cout << "Processor: " << brand << ", Speed: " << speed << " GHz" << endl;
    }

    ~Processor()
    {
        cout << "Processor destroyed: " << brand << endl;
    }
};

class Laptop
{
    string model;
    Processor* proc;
public:
    Laptop(string m, Processor* p)
    {
        model = m;
        proc = p;
        cout << "Laptop created: " << model << endl;
    }

    void showLaptop()
    {
        cout << "Laptop Model: " << model << endl;
        proc->showProcessor();
    }

    ~Laptop()
    {
        cout << "Laptop destroyed: " << model << endl;
    }
};

int main()
{
    Processor p("Intel i7", 3);

    cout << "\n--- Laptop scope starts ---" << endl;
    {
        Laptop l("Dell XPS", &p);
        l.showLaptop();
        cout << "--- Laptop scope ends ---" << endl;
    }

    cout << "\nProcessor still works after Laptop is gone:" << endl;
    p.showProcessor();

    return 0;
}