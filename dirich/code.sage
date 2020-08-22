for M in range(1,10): 
    for i,d in enumerate(DirichletGroup(M)): 
        o = circle(center=(0,0),radius =sqrt(M),color="grey") 
        rs = [Color(r) for r in rainbow(M)] 
        for r in range(M): 
            z = CC.zeta(M)^r 
            po = [CC(0)] 
            zi = z 
            for n in range(1,M): 
                po.append(po[-1] + d(n)*zi) 
                zi *= z 
                o += line([CC(0),po[-1]],color=rs[r].darker((M - 1 - n)*3/(5*M)), thickness=1.5, alpha=0.35) 
            print(r,po[-1]) 
            o += point(po[-1], zorder=10, color=rs[r], alpha=0.5) 
 
        o.save("%s-%s.png"%(M,d.conrey_number()),dpi=300,axes=False,fig_tight=False, figsize=[5,5]) 
