# CableVLA

**Simulation-Privileged Global–Local Representation Learning for Cable Routing**

[中文版](docs/README_zh.md)

CableVLA is a multimodal vision–language–action framework for robotic cable routing. It learns global cable-topology and local tactile representations from simulation-privileged supervision, combining visual context with contact feedback to guide cable manipulation.

- **CableVLA** combines topology-conditioned action generation with contact-gated force–tactile refinement for robotic cable routing.
- **TopoHead** learns temporal cable-topology representations through privileged physical supervision and teacher–student distillation, providing global context from visual observations.
- **TacSense** captures whole-field temporal changes and taxel-local dynamics with a dual-branch tactile encoder, learning representations of contact, loading, and slip.
